'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    MessageSquare,
    User,
    Car,
    RefreshCw,
    Clock
} from 'lucide-react';
import { conversationService } from '@/services/conversation.service';
import { ConversationMessage } from '@/types/conversation.types';
import { useRouter } from 'next/navigation';

export default function AdminConversationsPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const router = useRouter();


    // 1. Fetch all conversations using React Query
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

    // Derive active conversation ID safely without an effect
    const activeConversationId = selectedConversationId ?? (conversations.length > 0 ? conversations[0].id : null);

    // 2. Fetch specific conversation details & messages for the active ID
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const messages = activeDetails?.messages || [];
    const currentConversationMeta = conversations.find(c => c.id === activeConversationId);

    // Auto-scroll to bottom of chat when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Filtered conversations list based on search input
    const filteredConversations = conversations.filter(conv =>
        conv.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex -m-6 h-[calc(100vh-4rem)] w-[calc(100%+3rem)] overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

            {/* LEFT SIDEBAR: Conversations List */}
            <div className={`w-full md:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${selectedConversationId && 'hidden md:flex'}`}>

                {/* Header & Search */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <h1 className="text-lg font-bold">User Conversations</h1>
                        </div>
                        <button
                            onClick={() => refetchConversations()}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                            title="Refresh conversations"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoadingConversations ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search driver, passenger, or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Conversation Items List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {isLoadingConversations && conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                            <p className="text-sm">Loading conversations...</p>
                        </div>
                    ) : isConversationsError ? (
                        <div className="p-6 text-center text-red-500 text-sm">
                            Failed to load conversations. Please try again.
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                            <MessageSquare className="w-8 h-8 opacity-40" />
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => {
                            const isSelected = conv.id === selectedConversationId;
                            return (
                                <div
                                    key={conv.id}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected
                                        ? 'bg-indigo-50/80 dark:bg-indigo-950/30 border-l-4 border-indigo-600 dark:border-indigo-500'
                                        : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            Ride #{conv.ride_id}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="font-medium text-sm truncate">
                                            <span className="text-indigo-600 dark:text-indigo-400">{conv.driver_name}</span>
                                            <span className="text-slate-400 mx-1.5">&</span>
                                            <span className="text-amber-600 dark:text-amber-400">{conv.passenger_name}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                                        {conv.last_message || 'No messages yet'}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* RIGHT AREA: Active Conversation Thread & User Details Panel */}
            <div className={`flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 ${!selectedConversationId && 'hidden md:flex'}`}>
                {selectedConversationId && currentConversationMeta ? (
                    <>
                        {/* Chat Top Navbar */}
                        <div className="px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs cursor-pointer" onClick={() => router.push(`/rides/${currentConversationMeta.ride_id}`)}>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSelectedConversationId(null)}
                                    className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                >
                                    ← Back
                                </button>
                                <div>
                                    <div className="flex items-center gap-2 cursor-pointer" >
                                        <h2 className="font-semibold text-base">
                                            {currentConversationMeta.driver_name} & {currentConversationMeta.passenger_name}
                                        </h2>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                                            Booking #{currentConversationMeta.booking_id}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5" 
                                    >
                                        <Car className="w-3.5 h-3.5 text-indigo-500" /> Ride ID: {currentConversationMeta.ride_id}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Participant Contacts */}
                            <div className="hidden lg:flex items-center gap-4 text-xs">
                                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Driver: <strong>{currentConversationMeta.driver_phone}</strong></span>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Passenger: <strong>{currentConversationMeta.passenger_phone}</strong></span>
                                </div>
                            </div>
                        </div>

                        {/* Message History Feed - WhatsApp-style Side-by-Side Layout */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {isLoadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                                    <MessageSquare className="w-10 h-10 opacity-30" />
                                    <p className="text-sm">No message records found for this conversation.</p>
                                </div>
                            ) : (
                                messages.map((msg: ConversationMessage) => {
                                    // sender_role "2" = Driver (Left), "3" = Passenger (Right)
                                    const isDriver = String(msg.sender_role) === '2';
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col max-w-[70%] ${isDriver ? 'items-start mr-auto' : 'items-end ml-auto'}`}
                                        >
                                            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 px-1">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.sender_name}</span>
                                                <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${isDriver ? 'bg-indigo-500/10 text-indigo-600' : 'bg-amber-500/10 text-amber-600'
                                                    }`}>
                                                    {isDriver ? 'Driver' : 'Passenger'}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>

                                            <div className={`p-3 rounded-2xl text-sm shadow-xs ${isDriver
                                                ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-sm text-slate-800 dark:text-slate-200'
                                                : 'bg-indigo-600 text-white rounded-tr-sm'
                                                }`}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                        <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                            <MessageSquare className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-medium">Select a conversation from the left to inspect user chats</p>
                    </div>
                )}
            </div>
        </div>
    );
}