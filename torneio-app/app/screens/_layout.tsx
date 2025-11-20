import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer, } from 'expo-router/drawer';

import { View, Text, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
type DrawerIconProps = { focused?: boolean; color?: string; size?: number };

export default function RootLayout() {
  return (
    // 1. O GestureHandlerRootView é necessário para o Drawer
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Drawer
        screenOptions={{
          headerShown: true,
          drawerActiveBackgroundColor: 'transparent',
          drawerInactiveBackgroundColor: 'transparent',
          drawerInactiveTintColor: '#bababaff',
          drawerActiveTintColor: '#ffff',
          drawerHideStatusBarOnOpen: true,

          drawerStyle: {
            paddingTop: 22,
            backgroundColor: '#0f172a', //cor do menu lateral
            width: "20%",

          },

          drawerLabelStyle: {
            marginLeft: -20,

          },
         sceneStyle: {
           backgroundColor: '#0f172a',

         },
          headerLeft: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
        
              <Text style={{ color: 'black', marginLeft: 10, fontSize: 16 }}>
                Login
              </Text>
            </View>
          ),
        }}
        >
       <Drawer.Screen
          name="index" // app/home.js
          options={{
            title: '',
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <AntDesign name="home" size={size} color={color ?? 'white'} />
            ),
          }}
        />
    
        <Drawer.Screen
          name="sobre" // app/sobre.js
          options={{
            title: '',
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <AntDesign name="user" size={size} color={color ?? 'white'} />
            ),
          }}
        />
        <Drawer.Screen
          name="curriculo" // app/contato.js
          options={{
            title: '',
            drawerIcon: ({ color , size }: DrawerIconProps) => (
              <AntDesign name="phone" size={size} color={color ?? 'white'} />
            ),
          }}
        />
        <Drawer.Screen
          name="projetos" // app/projetos.js
          options={{
            title: '',
            drawerIcon: ({ color, size }: DrawerIconProps) => (
              <AntDesign name="book" size={size} color={color ?? 'white'} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}