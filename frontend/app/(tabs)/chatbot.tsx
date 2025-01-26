import React, { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
    { sender: 'user', text: 'Hello! Can you suggest a health breakfast?' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Function to handle sending messages
  const sendMessage = () => {
    if (messageInput.trim() === '') return;

    // Add user message to chat
    const userMessage: Message = { sender: 'user', text: messageInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setMessageInput('');

    // Simulate a bot response
    setTimeout(() => {
      const botMessage: Message = { sender: 'bot', text: 'I am here to help you with your questions!' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
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

        <View className="flex-row items-center p-4 border-t border-gray-200">
          <TextInput
            value={messageInput}
            onChangeText={setMessageInput}
            placeholder="Type a message"
            className="flex-1 h-12 px-4 border border-gray-300 rounded-lg"
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-4 py-3 px-6 bg-blue-500 rounded-lg"
          >
            <Text className="text-white font-semibold">Send</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

export default Chatbot;
