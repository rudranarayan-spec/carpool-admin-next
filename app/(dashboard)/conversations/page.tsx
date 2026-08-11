/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    MessageSquare,
    User,
    Car,
    RefreshCw,
    Clock,
    Trash2,
    Eraser,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { conversationService } from '@/services/conversation.service';
import { ConversationMessage } from '@/types/conversation.types';
import { useRouter } from 'next/navigation';

export default function AdminConversationsPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const router = useRouter();

    // 1. Fetch all conversations
    const {
        data: conversationsResponse,
        isLoading: isLoadingConversations,
        isError: isConversationsError,
        refetch: refetchConversations
    } = useQuery({
        queryKey: ['admin-conversations'],
        queryFn: () => conversationService.getAllConversations(),
        refetchInterval: 10000,
    });

    const conversations = conversationsResponse?.data || [];

    // Automatically set the first conversation if none selected
    useEffect(() => {
        if (!selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [conversations, selectedConversationId]);

    const activeConversationId = selectedConversationId;

    // 2. Fetch specific conversation details & messages
    const {
        data: activeConversationData,
        isLoading: isLoadingMessages
    } = useQuery({
        queryKey: ['admin-conversation-messages', activeConversationId],
        queryFn: () => conversationService.getConversationMessages(activeConversationId!),
        enabled: !!activeConversationId,
        refetchInterval: 5000,
    });

    const activeDetails = activeConversationData?.data;
    const messages = activeDetails?.messages || [];
    const currentConversationMeta = conversations.find(c => c.id === activeConversationId);

    // 3. Clear All Messages Mutation
    const clearMessagesMutation = useMutation({
        mutationFn: (conversationId: number) => conversationService.clearConversationMessages(conversationId),
        onSuccess: (_, conversationId) => {
            queryClient.invalidateQueries({ queryKey: ['admin-conversation-messages', conversationId] });
            queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
            toast.success('Conversation messages cleared successfully.');
        },
        onError: (error) => {
            console.error('Failed to clear conversation messages:', error);
            toast.error('Failed to clear conversation messages.');
        }
    });

    // 4. Delete Single Message Mutation
    const deleteSingleMessageMutation = useMutation({
        mutationFn: (messageId: number) => conversationService.deleteMessage(messageId),
        onMutate: (messageId) => {
            setDeletingMessageId(messageId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-conversation-messages', activeConversationId] });
            queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
            toast.success('Message deleted.');
        },
        onError: (error) => {
            console.error('Failed to delete message:', error);
            toast.error('Failed to delete message.');
        },
        onSettled: () => {
            setDeletingMessageId(null);
        }
    });

    // 5. Delete Full Conversation Mutation
    const deleteConversationMutation = useMutation({
        mutationFn: (conversationId: number) => conversationService.deleteConversation(conversationId),
        onSuccess: () => {
            setSelectedConversationId(null);
            queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
            toast.success('Conversation deleted permanently.');
        },
        onError: (error) => {
            console.error('Failed to delete conversation:', error);
            toast.error('Failed to delete conversation.');
        }
    });

    // Sonner Confirmation Toast Handlers
    const handleClearMessages = (conversationId: number) => {
        toast('Clear all messages in this conversation?', {
            description: 'This action will wipe all history inside this thread.',
            action: {
                label: 'Clear All',
                onClick: () => clearMessagesMutation.mutate(conversationId),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { },
            },
        });
    };

    const handleDeleteConversation = (conversationId: number) => {
        toast('Delete full conversation?', {
            description: 'This action cannot be undone and will remove the thread.',
            action: {
                label: 'Delete Thread',
                onClick: () => deleteConversationMutation.mutate(conversationId),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { },
            },
        });
    };

    const handleDeleteSingleMessage = (messageId: number) => {
        toast('Delete message?', {
            description: 'Are you sure you want to delete this specific message?',
            action: {
                label: 'Delete',
                onClick: () => deleteSingleMessageMutation.mutate(messageId),
            },
            cancel: {
                label: 'Cancel',
                onClick: () => { },
            },
        });
    };

    // Auto-scroll to bottom of chat when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // Filtered conversations list based on search input
    const filteredConversations = conversations.filter(conv =>
        conv.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">

            {/* LEFT SIDEBAR: Conversations List */}
            <div className={`w-full md:w-80 lg:w-96 shrink-0 flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>

                {/* Header & Search */}
               <div className="h-26.25 shrink-0 p-3.5 border-b border-slate-200 dark:border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Conversations</h1>
                        </div>
                        <button
                            onClick={() => refetchConversations()}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-400"
                            title="Refresh conversations"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoadingConversations ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search driver, passenger, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-zinc-800 border-none rounded-lg focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                        />
                    </div>
                </div>

                {/* Conversation Items List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/60">
                    {isLoadingConversations && conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-zinc-500 space-y-2">
                            <RefreshCw className="w-5 h-5 animate-spin text-zinc-700 dark:text-zinc-300" />
                            <p className="text-xs">Loading conversations...</p>
                        </div>
                    ) : isConversationsError ? (
                        <div className="p-4 text-center text-rose-500 text-xs">
                            Failed to load conversations. Please try again.
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-zinc-500 space-y-1.5">
                            <MessageSquare className="w-6 h-6 opacity-40" />
                            <p className="text-xs">No conversations found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const isSelected = conv.id === activeConversationId;
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                    className={`p-3.5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${isSelected
                                        ? "bg-slate-100 dark:bg-zinc-800/80 border-l-4 border-zinc-900 dark:border-zinc-100"
                                        : ""
                                        }`}
                                >
                                    {/* Header Section */}
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate">
                                                #{conv.id}
                                            </span>
                                            <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                                Ride #{conv.ride_id}
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {conv.last_message_at
                                                ? new Date(conv.last_message_at).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : ""}
                                        </span>
                                    </div>

                                    {/* User Details */}
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="font-medium text-xs truncate whitespace-nowrap">
                                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                                                {conv.driver_name}
                                            </span>
                                            <span className="text-slate-400 dark:text-zinc-500 mx-1">&</span>
                                            <span className="text-amber-700 dark:text-amber-400 font-semibold">
                                                {conv.passenger_name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Last Message Preview */}
                                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-1">
                                        {conv.last_message || "No messages yet"}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT AREA: Active Conversation Thread */}
            <div className={`flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-zinc-950 ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                {activeConversationId && currentConversationMeta ? (
                    <>
                        {/* Chat Top Navbar */}
                        <div className="h-[57px] px-4 py-2 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-xs shrink-0 whitespace-nowrap">
                            <div className="flex items-center space-x-3 min-w-0 shrink">
                                <button
                                    onClick={() => setSelectedConversationId(null)}
                                    className="md:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 shrink-0"
                                    title="Back to conversation list"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <div
                                    className="min-w-0 cursor-pointer overflow-hidden"
                                    onClick={() => router.push(`/rides/${currentConversationMeta.ride_id}`)}
                                >
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold text-sm truncate text-zinc-900 dark:text-zinc-100">
                                            {currentConversationMeta.driver_name} & {currentConversationMeta.passenger_name}
                                        </h2>
                                        <span className="hidden lg:inline-block text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold shrink-0">
                                            Booking #{currentConversationMeta.booking_id}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                        <Car className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 shrink-0" /> Ride ID: {currentConversationMeta.ride_id}
                                    </p>
                                </div>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleClearMessages(activeConversationId)}
                                    disabled={clearMessagesMutation.isPending}
                                    className="p-1.5 px-2.5 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50 border border-amber-200 dark:border-amber-900/50"
                                    title="Clear all messages in conversation"
                                >
                                    <Eraser className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Clear Messages</span>
                                </button>

                                <button
                                    onClick={() => handleDeleteConversation(activeConversationId)}
                                    disabled={deleteConversationMutation.isPending}
                                    className="p-1.5 px-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50 border border-rose-200 dark:border-rose-900/50"
                                    title="Delete full conversation"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Delete Thread</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Participant Contacts Sub-bar */}
                        <div className="px-4 py-1.5 bg-slate-100/90 dark:bg-zinc-900/60 border-b border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs overflow-x-auto shrink-0 whitespace-nowrap">
                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-slate-500 dark:text-zinc-400">Driver:</span>
                                    <strong className="text-slate-800 dark:text-zinc-200 font-semibold">{currentConversationMeta.driver_phone}</strong>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                    <span className="text-slate-500 dark:text-zinc-400">Passenger:</span>
                                    <strong className="text-slate-800 dark:text-zinc-200 font-semibold">{currentConversationMeta.passenger_phone}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Message History Feed */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 min-w-0">
                            {isLoadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <RefreshCw className="w-5 h-5 animate-spin text-zinc-700 dark:text-zinc-300" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-500 space-y-1.5">
                                    <MessageSquare className="w-8 h-8 opacity-30" />
                                    <p className="text-xs">No message records found for this conversation.</p>
                                </div>
                            ) : (
                                messages.map((msg: ConversationMessage) => {
                                    const isDriver = String(msg.sender_role) === '2';
                                    const isDeletingThis = deletingMessageId === msg.id;

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`group flex flex-col max-w-[85%] sm:max-w-[75%] min-w-0 ${isDriver ? 'items-start mr-auto' : 'items-end ml-auto'}`}
                                        >
                                            {/* Sender Details */}
                                            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 dark:text-zinc-500 px-1 max-w-full overflow-hidden">
                                                <span className="font-semibold text-slate-700 dark:text-zinc-300 truncate">
                                                    {msg.sender_name}
                                                </span>
                                                <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold shrink-0 ${isDriver ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'}`}>
                                                    {isDriver ? 'Driver' : 'Passenger'}
                                                </span>
                                                <span className="shrink-0">•</span>
                                                <span className="shrink-0">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Message Bubble + Actions Container */}
                                            <div className={`flex items-center gap-1.5 max-w-full ${isDriver ? 'flex-row' : 'flex-row-reverse'}`}>
                                                {/* Message Bubble with Word Break */}
                                                <div
                                                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs min-w-0 break-words [overflow-wrap:anywhere] whitespace-pre-wrap ${isDriver
                                                        ? 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-tl-xs text-slate-800 dark:text-zinc-100'
                                                        : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-tr-xs'
                                                        }`}
                                                >
                                                    {msg.message}
                                                </div>

                                                {/* Delete Single Message Button */}
                                                <button
                                                    onClick={() => handleDeleteSingleMessage(msg.id)}
                                                    disabled={isDeletingThis || deleteSingleMessageMutation.isPending}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 dark:hover:bg-zinc-800 rounded-md shrink-0 disabled:opacity-100"
                                                    title="Delete message"
                                                >
                                                    {isDeletingThis ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
                                                    ) : (
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-500 space-y-2 p-4 text-center">
                        <div className="p-3 bg-zinc-200/60 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium">Select a conversation from the left sidebar to inspect user messages.</p>
                    </div>
                )}
            </div>
        </div>
    );
}