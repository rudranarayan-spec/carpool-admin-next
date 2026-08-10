/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

// Define Premium Enterprise PDF Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#334155", // slate-700
    backgroundColor: "#ffffff",
  },

  // --- BRAND & HEADER SECTION ---
  brandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e2e8f0",
  },
  logoContainer: {
    flexDirection: "column",
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a", // slate-900
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  brandLink: {
    fontSize: 8,
    color: "#2563eb",
    marginTop: 3,
    textDecoration: "none",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docMeta: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 3,
  },

  // --- STATUS BADGES ---
  badgeCompleted: {
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    backgroundColor: "#dcfce7", // emerald-100
    color: "#166534", // emerald-800
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  badgePending: {
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    backgroundColor: "#fef3c7", // amber-100
    color: "#92400e", // amber-800
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  badgeDefault: {
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    backgroundColor: "#e0f2fe", // sky-100
    color: "#0369a1", // sky-800
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },

  // --- SECTIONS & CARDS ---
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardGrid: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 10,
  },
  col2: {
    width: "50%",
    paddingRight: 8,
  },
  col2Last: {
    width: "50%",
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#cbd5e1",
  },

  // --- FIELD TYPOGRAPHY ---
  fieldGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  valuePrimary: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  valueSecondary: {
    fontSize: 8.5,
    color: "#475569",
    marginTop: 1,
  },

  // --- TABLES ---
  table: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },

  // Table Column Sizes
  colId: { width: "18%" },
  colPassenger: { width: "27%" },
  colSeats: { width: "10%", textAlign: "center" },
  colRoute: { width: "30%" },
  colAmount: { width: "15%", textAlign: "right" },

  // --- FINANCIAL BREAKDOWN ---
  financialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  finCard: {
    width: "23.5%",
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  finCardHighlight: {
    width: "23.5%",
    padding: 8,
    backgroundColor: "#f0fdf4", // emerald-50
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  finLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  finValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginTop: 4,
  },
  finValueHighlight: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#15803d",
    marginTop: 4,
  },

  // --- FOOTER ---
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7.5,
    color: "#94a3b8",
  },
  footerLink: {
    fontSize: 7.5,
    color: "#2563eb",
    textDecoration: "none",
  },
});

interface RideInvoicePDFProps {
  ride: any;
}

export const RideInvoicePDF: React.FC<RideInvoicePDFProps> = ({ ride }) => {
  const statusUpper = (ride?.header?.status || "CONFIRMED").toUpperCase();

  const getStatusBadgeStyle = () => {
    if (statusUpper === "COMPLETED") return styles.badgeCompleted;
    if (statusUpper === "PENDING") return styles.badgePending;
    return styles.badgeDefault;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* BRAND & HEADER */}
        <View style={styles.brandHeader}>
          <View style={styles.logoContainer}>
            <Text style={styles.brandName}>PoolShare</Text>
            <Text style={styles.brandTagline}>
              Powered by Maastrix Solutions
            </Text>
            <Link src="https://maastrixsolutions.com/" style={styles.brandLink}>
              https://maastrixsolutions.com/
            </Link>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>Ride Summary & Invoice</Text>
            <Text style={styles.docMeta}>
              Ride Code: #{ride?.header?.ride_code || "N/A"}
            </Text>
            <Text style={styles.docMeta}>
              Date: {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
            <View style={getStatusBadgeStyle()}>
              <Text>{statusUpper}</Text>
            </View>
          </View>
        </View>

        {/* ROUTE & SCHEDULE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Route & Schedule</Text>
          </View>
          <View style={styles.cardGrid}>
            <View style={styles.col2}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Pickup Location</Text>
                <Text style={styles.valuePrimary}>
                  {ride?.route_schedule?.pickup?.location || "N/A"}
                </Text>
              </View>
              {ride?.route_schedule?.pickup?.scheduled_at && (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.label}>Scheduled Departure</Text>
                  <Text style={styles.valueSecondary}>
                    {new Date(
                      ride.route_schedule.pickup.scheduled_at
                    ).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.col2Last}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Dropoff Location</Text>
                <Text style={styles.valuePrimary}>
                  {ride?.route_schedule?.dropoff?.location || "N/A"}
                </Text>
              </View>
              {ride?.route_schedule?.dropoff?.estimated_arrival && (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.label}>Estimated Arrival</Text>
                  <Text style={styles.valueSecondary}>
                    {ride.route_schedule.dropoff.estimated_arrival}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* DRIVER & VEHICLE INFO */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Driver & Vehicle Information</Text>
          </View>
          <View style={styles.cardGrid}>
            <View style={styles.col2}>
              <Text style={styles.label}>Driver Details</Text>
              <Text style={styles.valuePrimary}>
                {ride?.driver_vehicle?.driver?.name || "N/A"}
              </Text>
              <Text style={styles.valueSecondary}>
                Phone: {ride?.driver_vehicle?.driver?.phone || "N/A"}
              </Text>
              <Text style={styles.valueSecondary}>
                Email: {ride?.driver_vehicle?.driver?.email || "N/A"}
              </Text>
            </View>

            <View style={styles.col2Last}>
              <Text style={styles.label}>Vehicle Information</Text>
              <Text style={styles.valuePrimary}>
                {ride?.driver_vehicle?.vehicle?.title || "N/A"}{" "}
                {ride?.driver_vehicle?.vehicle?.type
                  ? `(${ride.driver_vehicle.vehicle.type})`
                  : ""}
              </Text>
              <Text style={styles.valueSecondary}>
                Reg No: {ride?.driver_vehicle?.vehicle?.registration_number || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* PASSENGER BOOKINGS TABLE */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Passenger Bookings (
              {ride?.passenger_bookings?.length || 0})
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colId, styles.tableHeaderCell]}>
                Booking ID
              </Text>
              <Text style={[styles.colPassenger, styles.tableHeaderCell]}>
                Passenger
              </Text>
              <Text style={[styles.colSeats, styles.tableHeaderCell]}>
                Seats
              </Text>
              <Text style={[styles.colRoute, styles.tableHeaderCell]}>
                Route
              </Text>
              <Text style={[styles.colAmount, styles.tableHeaderCell]}>
                Amount
              </Text>
            </View>

            {ride?.passenger_bookings?.map((booking: any, index: number) => {
              const isEven = index % 2 === 0;
              return (
                <View
                  key={booking.booking_id || index}
                  style={isEven ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={[styles.colId, { fontFamily: "Helvetica-Bold" }]}>
                    {booking.booking_code || "N/A"}
                  </Text>
                  <View style={styles.colPassenger}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>
                      {booking.passenger_name}
                    </Text>
                    <Text style={{ fontSize: 7.5, color: "#64748b" }}>
                      {booking.passenger_phone}
                    </Text>
                  </View>
                  <Text style={styles.colSeats}>{booking.seats}</Text>
                  <View style={styles.colRoute}>
                    <Text style={{ fontSize: 7.5, color: "#334155" }}>
                      From: {booking.pickup_location}
                    </Text>
                    <Text style={{ fontSize: 7.5, color: "#64748b" }}>
                      To: {booking.dropoff_location}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.colAmount,
                      { fontFamily: "Helvetica-Bold", color: "#0f172a" },
                    ]}
                  >
                    ₹{Number(booking.amount_paid || 0).toLocaleString("en-IN")}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* FINANCIAL BREAKDOWN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Breakdown</Text>
          </View>
          <View style={styles.financialContainer}>
            <View style={styles.finCard}>
              <Text style={styles.finLabel}>Total Revenue</Text>
              <Text style={styles.finValue}>
                ₹
                {Number(
                  ride?.financial_breakup?.total_revenue || 0
                ).toLocaleString("en-IN")}
              </Text>
            </View>

            <View style={styles.finCard}>
              <Text style={styles.finLabel}>Platform Fee</Text>
              <Text style={styles.finValue}>
                ₹
                {Number(
                  ride?.financial_breakup?.platform_fee || 0
                ).toFixed(2)}
              </Text>
            </View>

            <View style={styles.finCard}>
              <Text style={styles.finLabel}>GST / Tax</Text>
              <Text style={styles.finValue}>
                ₹
                {Number(ride?.financial_breakup?.gst_tax || 0).toFixed(2)}
              </Text>
            </View>

            <View style={styles.finCardHighlight}>
              <Text style={[styles.finLabel, { color: "#166534" }]}>
                Driver Payout
              </Text>
              <Text style={styles.finValueHighlight}>
                ₹
                {Number(
                  ride?.financial_breakup?.driver_payout || 0
                ).toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Official system-generated invoice report from PoolShare | Powered by{" "}
            <Link src="https://maastrixsolutions.com/" style={styles.footerLink}>
              Maastrix Solutions
            </Link>
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};