import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ViewFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const fetchFeedback = () => {
    const vendorEmail = FIREBASE_AUTH.currentUser?.email;
    if (!vendorEmail) return;

    const feedbackRef = collection(FIREBASE_DB, "feedback");
    const vendorQuery = query(feedbackRef, where("restaurantName", "==", "Your Restaurant Name")); // Replace dynamically

    const unsubscribe = onSnapshot(vendorQuery, (snapshot) => {
      const reviews = snapshot.docs.map(doc => doc.data());
      setFeedbacks(feedbacks);

      // Calculate average rating
      const totalRatings = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      const avgRating = reviews.length ? (totalRatings / reviews.length).toFixed(1) : 0;
    //   setAverageRating(avgRating);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchFeedback();
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* Overall Rating Section */}
      <View style={styles.overallRating}>
        <Text style={styles.ratingScore}>{averageRating}</Text>
        <Text style={styles.ratingLabel}>Overall Rating</Text>
        <Text style={styles.reviewCount}>{feedbacks.length} Reviews</Text>
      </View>
  
      {/* Ratings Breakdown */}
      <View style={styles.breakdown}>
        <Text style={styles.breakdownLabel}>Ratings Breakdown</Text>
        {["Excellent", "Good", "Average", "Poor"].map((label, index) => (
          <View key={index} style={styles.breakdownRow}>
            <Text>{label}</Text>
            <View style={styles.progressBar}>
              {/* Replace with dynamic progress based on feedbacks */}
              <View style={{ ...styles.progressFill, width: `${Math.random() * 100}%` }} />
            </View>
          </View>
        ))}
      </View>
  
      {/* Customer Reviews */}
      <FlatList
        data={feedbacks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            {/* <Image source={{ uri: item.userImage || "https://via.placeholder.com/50" }} style={styles.userImage} /> */}
            <View style={styles.reviewContent}>
              {/* <Text style={styles.userName}>{item.userName || "Anonymous"}</Text>
              <Text style={styles.reviewText}>{item.feedbackText}</Text> */}
            </View>
          </View>
        )}
      />
    </View>
  );
}
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    overallRating: { alignItems: "center", marginVertical: 20 },
    ratingScore: { fontSize: 48, fontWeight: "bold" },
    ratingLabel: { fontSize: 18, color: "#666" },
    reviewCount: { fontSize: 14, color: "#999" },
    breakdown: { marginVertical: 20 },
    breakdownLabel: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    breakdownRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    progressBar: { flex: 1, height: 8, backgroundColor: "#eee", marginHorizontal: 10, borderRadius: 4 },
    progressFill: { height: 8, backgroundColor: "#4CAF50", borderRadius: 4 },
    reviewCard: { flexDirection: "row", marginVertical: 10, padding: 10, borderRadius: 8, backgroundColor: "#f9f9f9" },
    userImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    reviewContent: { flex: 1 },
    userName: { fontSize: 16, fontWeight: "bold" },
    reviewText: { fontSize: 14, color: "#666" },
  });
