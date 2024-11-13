import React, { useEffect } from "react";
import { SplashScreen, Stack, useSegments, router } from "expo-router";
import { useFonts } from "expo-font";
import { AuthContextProvider, useAuth } from "@/context/AuthContext";
import "./global.css";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  //const segments = useSegments();

  useEffect(() => {
    // Ensure we only run the redirection logic when 'isAuthenticated' is defined
    if (typeof isAuthenticated === 'undefined') return;

    //const inApp = segments[0] === "(tabs)"; // Check if we're in the "(tabs)" segment
    console.log( "and", isAuthenticated);

    if (isAuthenticated ) {
      // Redirect to home if authenticated but not in the "(tabs)" segment
      router.replace("/home");
    } else if (!isAuthenticated ) {
      // Redirect to sign-in if not authenticated and currently in the "(tabs)" segment
      router.replace('/sign-in');
    }
  }, [isAuthenticated]); // Run this effect only when 'isAuthenticated' or 'segments' change

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="listing/[id]"
        options={{
          headerShown: true,
          title: "Listing Details", // Customize title as needed
        }}
      />
      <Stack.Screen
        name="components/EditProfile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
    
  );
};

export default function rootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}

// import React, { useEffect } from "react";
// import { SplashScreen, Stack, Slot, useSegments, router, Redirect  } from "expo-router";
// import { useFonts } from "expo-font";
// import { AuthContextProvider, useAuth } from "@/context/AuthContext";

// import "./global.css";

// const MainLayout = () => {
//   const {isAuthenticated} = useAuth();
//   const segments = useSegments();
//   useEffect( () => {
//     const inApp = segments[0] == "(tabs)"
//     console.log(segments, " and ", isAuthenticated)
//     if(typeof isAuthenticated == 'undefined') return;
//     else if (isAuthenticated && !inApp){
//       router.replace("/home");
//     }
//     else if (!isAuthenticated && inApp){
//       router.replace('/sign-in')
//     }
//   })

//   return (
//     <Stack>
//         <Stack.Screen
//           name="index"
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="(auth)"
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//           name="(tabs)"
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen
//         name="listing/[id]"
//         options={{
//           headerShown: true,
//           title: "Listing Details", // Customize title as needed
//         }}
//       />
//     </Stack>
//   )
// }

// export default function rootLayout() {
//   const [fontsLoaded, error] = useFonts({
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//     "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (error) throw error;

//     if (fontsLoaded) SplashScreen.hideAsync();
//   }, [fontsLoaded, error]);

//   if (!fontsLoaded && !error) return null;
//   return (
//     <AuthContextProvider>
//       <MainLayout/>
//     </AuthContextProvider>
//   );
// }
