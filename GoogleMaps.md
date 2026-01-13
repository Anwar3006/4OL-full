## Google Maps Integration

To use the Google Maps component, you will need to set up a Google Maps API key.

1.  **Obtain an API key:** Follow the instructions in the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview) to create a new project and obtain a Maps JavaScript API key.
2.  **Enable APIs:** Make sure to enable the "Maps JavaScript API" and "Geocoding API" for your project.
3.  **Set up environment variables:** Create a `.env.local` file in the `apps/web` directory and add the following line:

    ```
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
    ```

    Replace `your_api_key_here` with the API key you obtained in the first step.
4.  **Restart the development server:** After adding the environment variable, you will need to restart the development server for the changes to take effect.
