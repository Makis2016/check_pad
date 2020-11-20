import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from '@ant-design/react-native';
import styled from 'styled-components/native';
import AnimatedTabBarNavigator from '@/components/thirdparty/react-native-animated-nav-tab-bar/src/AnimatedTabBarNavigator';
import BaseView from '@/components/common/baseView';
import TaskView from '@/views/taskView';
import PdfViewer from '@/components/business/pdfViewer';

const Tabs = AnimatedTabBarNavigator();

const Screen = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #f2f2f2;
`;

const Discover = (props) => (
    <Screen>
        <Text>Discover</Text>
        <TouchableOpacity onPress={() => props.navigation.navigate('Task')}>
            <Text>Go to Home</Text>
        </TouchableOpacity>
    </Screen>
);

const Images = () => (
    <Screen>
        <PdfViewer style={{ width: '100%', height: '100%' }} />
    </Screen>
);

const Profile = () => (
    <Screen>
        <Text>Profile</Text>
    </Screen>
);

/**
 * 主视图
 *
 * @export
 * @class HomeView
 * @extends {BaseView}
 */
export default class HomeView extends BaseView {
    _render() {
        return (
            <Tabs.Navigator initialRouteName="Task">
                <Tabs.Screen
                    name="Task"
                    component={TaskView}
                    options={{
                        tabBarIcon: ({ focused, color }) => <Icon focused={focused} color={color} size="md" name="account-book" />,
                    }}
                />
                <Tabs.Screen
                    name="Discover"
                    component={Discover}
                    options={{
                        tabBarIcon: ({ focused, color }) => <Icon focused={focused} color={color} size="md" name="search" />,
                    }}
                />
                <Tabs.Screen
                    name="Images"
                    component={Images}
                    options={{
                        tabBarIcon: ({ focused, color }) => <Icon focused={focused} color={color} size="md" name="image" />,
                    }}
                />
                <Tabs.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ focused, color }) => <Icon focused={focused} color={color} size="md" name="user" />,
                    }}
                />
            </Tabs.Navigator>
        );
    }
}
