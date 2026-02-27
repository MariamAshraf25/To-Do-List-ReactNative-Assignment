import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import * as Font from 'expo-font';

export default function App() {
  const [enteredGoalText, setEnteredGoalText] = useState(''); 
  const [activeGoals, setActiveGoals] = useState([]); 
  const [completedGoals, setCompletedGoals] = useState([]); 
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'custom-font': require('./assets/fonts/Delius-Regular.ttf'), 
        });
      } catch (e) {
        console.log("Font loading failed, using system font.");
      }
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  function addGoalHandler() {
    if (enteredGoalText.trim().length === 0) return;
    setActiveGoals((currentGoals) => [
      ...currentGoals,
      { text: enteredGoalText, id: Math.random().toString() },
    ]);
    setEnteredGoalText(''); 
  }

  function completeGoalHandler(goal) {
    setActiveGoals(currentActive => currentActive.filter(g => g.id !== goal.id));
    setCompletedGoals(currentDone => [...currentDone, goal]);
  }

  function deleteGoalHandler(goalId, listType) {
    if (listType === 'active') {
      setActiveGoals(current => current.filter(g => g.id !== goalId));
    } else {
      setCompletedGoals(current => current.filter(g => g.id !== goalId));
    }
  }

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.appContainer}
    >
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>To-Do List</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Add a new task..."
          onChangeText={setEnteredGoalText}
          value={enteredGoalText}
          placeholderTextColor="#a2ad9c"
        />
        <TouchableOpacity style={styles.addButton} onPress={addGoalHandler}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}> 
        <Text style={styles.sectionTitle}>Active Tasks</Text>
        <FlatList
          data={activeGoals}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true} 
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={(itemData) => (
            <View style={styles.goalItem}>
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={() => completeGoalHandler(itemData.item)} 
              />
              <Text style={styles.goalText}>{itemData.item.text}</Text>
              <TouchableOpacity onPress={() => deleteGoalHandler(itemData.item.id, 'active')}>
                <Text style={styles.trashIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {completedGoals.length > 0 && (
        <View style={styles.completedSection}>
          <Text style={styles.sectionTitle}>Completed Tasks</Text>
          <FlatList
            data={completedGoals}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true} 
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={(itemData) => (
              <View style={[styles.goalItem, styles.completedItem]}>
                <Text style={styles.completedText}>✓ {itemData.item.text}</Text>
                <TouchableOpacity onPress={() => deleteGoalHandler(itemData.item.id, 'done')}>
                  <Text style={styles.trashIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  appContainer: { 
    flex: 1, 
    paddingTop: 70, 
    paddingHorizontal: 25, 
    backgroundColor: '#f1f8f5' 
  },
  titleContainer: {
    marginBottom: 30,
    alignItems: 'center', 
  },
  headerText: { 
    color: '#1a3c34', 
    fontSize: 34, 
    fontWeight: '800', 
    fontFamily: 'custom-font'
  },
  inputContainer: { 
    flexDirection: 'row', 
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 18,
    shadowColor: '#1a3c34',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5
  },
  textInput: { 
    flex: 1, 
    paddingLeft: 15,
    fontSize: 16,
    color: '#1a3c34',
    fontFamily: 'custom-font'
  },
  addButton: { 
    backgroundColor: '#2d6a4f', 
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  addButtonText: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#1a3c34', 
    marginBottom: 15,
    letterSpacing: 0.5,
    fontFamily: 'custom-font'
  },
  listSection: {
    flex: 1, 
    marginBottom: 10
  },
  goalItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    padding: 16, 
    borderRadius: 18, 
    marginVertical: 7, 
    borderLeftWidth: 5,
    borderLeftColor: '#52b788', 
    elevation: 2 
  },
  checkbox: { 
    width: 24, 
    height: 24, 
    borderWidth: 2, 
    borderColor: '#52b788', 
    borderRadius: 8, 
    marginRight: 15,
    backgroundColor: '#f1f8f5'
  },
  goalText: { 
    flex: 1, 
    color: '#1a3c34', 
    fontSize: 16, 
    fontWeight: '500',
    fontFamily: 'custom-font'
  },
  completedSection: { 
    height: '40%', 
    marginTop: 10, 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#d8e8e0' 
  },
  completedItem: { 
    backgroundColor: '#e8f3ee', 
    opacity: 0.8,
    borderLeftColor: '#a2ad9c' 
  },
  completedText: { 
    flex: 1, 
    color: '#6b8c80', 
    textDecorationLine: 'line-through',
    fontFamily: 'custom-font' 
  },
  trashIcon: { fontSize: 20, marginLeft: 10 }
});