import Constants from 'expo-constants';
import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const CHATBOT_API_URL = Constants.expoConfig?.extra?.CHATBOT_API_URL;

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Welcome to CalCountAI.' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  const sendMessage = async () => {
    if (messageInput.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: messageInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setMessageInput('');

    try {
      const response = await fetch(`${CHATBOT_API_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageInput }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response from the bot: ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage: Message = { sender: 'bot', text: data.response };  

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      if (Platform.OS === "web") {
        alert("Error: \nUnable to fetch response from the chatbot.");
      } else {
        Alert.alert('Error', 'Unable to fetch response from the chatbot.');
      }
      
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-3xl font-bold text-center mt-6">AI Assistant</Text>

      <ScrollView className='px-4 mt-6'>
        {messages.map((message, index) => (
          <View key={index} className="mt-6">
            <View
              className={`p-3 rounded-xl ${message.sender === 'user' ? 'bg-blue-500 self-end' : 'bg-gray-300'}`}
              style={{
                maxWidth: '80%',
              }}
            >
              <Text className={`text-base ${message.sender === 'user' ? 'text-white' : 'text-black'}`}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center p-4 border-t border-gray-200 bg-gray-100">
        <TextInput
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Type a message"
          className="flex-1 h-12 px-4 border border-gray-300 rounded-full bg-white"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="flex flex-row items-center gap-2 ml-3 py-3.5 px-6 bg-blue-500 rounded-full"
        >
          <Text className="text-white font-semibold">Send</Text>
          <Icon name="send" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chatbot;
