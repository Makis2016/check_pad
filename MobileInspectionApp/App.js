import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeView from '@/views/home';
import LoginView from '@/views/login';
import TestTreeTableView from '@/views/test/testTreeTableView';
import TestView from '@/views/test/testView';
import ChargeManagementView from '@/views/chargeManagement';
import AssociatedView from '@/views/chargeManagement/associated';
import ApplyView from '@/views/chargeManagement/apply';

const Stack = createStackNavigator();

const App = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" headerMode="none" mode="modal">
            <Stack.Screen name="Login" component={LoginView} />
            <Stack.Screen name="Home" component={HomeView} />
            <Stack.Screen name="Test" component={TestTreeTableView} />
            <Stack.Screen name="TestView" component={TestView} />
            <Stack.Screen name="ChargeManagement" component={ChargeManagementView} />
            <Stack.Screen name="Associated" component={AssociatedView} />
            <Stack.Screen name="Apply" component={ApplyView} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default App;
