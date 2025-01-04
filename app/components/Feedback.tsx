import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tip, setTip] = useState(null);
  const [showName, setShowName] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const userEmail = auth.currentUser?.email;

  const handleRating = (star: React.SetStateAction<number>) => {
    setRating(star);
  };

  const submitFeedback = async () => {
    if (!rating || !comment.trim()) {
      Alert.alert('Error', 'Please provide a rating and comment.');
      return;
    }

    try {
      const feedbackRef = collection(FIREBASE_DB, 'feedback');
      await addDoc(feedbackRef, {
        email: userEmail,
        rating,
        comment,
        tip,
        showName,
        timestamp: new Date(),
      });

      setSubmitted(true);
      setRating(0);
      setComment('');
      setTip(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.thankYouContainer}>
          <Image
            source={require('../../assets/images/thankyou.jpg')}
            style={styles.thankYouImage}
          />
          <Text style={styles.thankYouText}>Thanks for your review</Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setSubmitted(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Rate Your Order</Text>
      </View>

      <View style={styles.feedbackForm}>
        <Text style={styles.sectionTitle}>How was your last order?</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRating(star)}
            >
              <MaterialIcons
                name="star"
                size={36}
                color={star <= rating ? '#FFD700' : '#DDD'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Leave a Comment</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Write your comment here..."
          multiline
        />

        <Text style={styles.sectionTitle}>Leave a Tip?</Text>
        <View style={styles.tipContainer}>
          {[5, 10, 15].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.tipButton,
                tip === amount && styles.selectedTipButton,
              ]}
              onPress={() => {}}
            >
              <Text
                style={[
                  styles.tipButtonText,
                  tip === amount && styles.selectedTipButtonText,
                ]}
              >
                {amount}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.switchContainer}>
          <Text>Show my name</Text>
          <Switch value={showName} onValueChange={setShowName} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={submitFeedback}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  feedbackForm: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tipButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 60,
    alignItems: 'center',
  },
  selectedTipButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  tipButtonText: {
    color: '#333',
  },
  selectedTipButtonText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  thankYouContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankYouImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
