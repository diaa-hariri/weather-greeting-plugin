<?php
/*
Plugin Name: Weather Greeting Plugin
Description: Displays a weather summary with icon, gradient background, and tooltip on hover.
Version: 1.9
Author: Diaa Al Hariri
Author URI: https://hariri.ch
*/

// Enqueue necessary CSS and JS files
function weather_greeting_enqueue_assets() {
    // Enqueue weather icons CSS from CDN
    wp_enqueue_style('weather-icons', 'https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.10/css/weather-icons.min.css', [], '2.0.10');

    // Enqueue plugin's custom CSS
    wp_enqueue_style('weather-greeting-css', plugin_dir_url(__FILE__) . 'css/weather-greeting.css', [], '1.0');

    // Enqueue plugin's custom JS and load it in footer
	wp_enqueue_script('weather-greeting-js', plugin_dir_url(__FILE__) . 'js/weather-greeting.js', [], '1.0', true);

    // Pass AJAX URL to JavaScript
    wp_localize_script('weather-greeting-js', 'weatherGreeting', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
    ]);
}
add_action('wp_enqueue_scripts', 'weather_greeting_enqueue_assets');

// Shortcode function to output the container div for weather info
function weather_greeting_func() {
    return '<div id="weather-greeting"></div>';
}
add_shortcode('weather_greeting', 'weather_greeting_func');

// Register AJAX handlers for logged-in and non-logged-in users
add_action('wp_ajax_get_weather', 'get_weather_callback');
add_action('wp_ajax_nopriv_get_weather', 'get_weather_callback');

// AJAX callback function to fetch weather data from OpenWeatherMap API
function get_weather_callback() {
    // Validate and sanitize latitude and longitude parameters from GET request
    $lat = isset($_GET['lat']) ? floatval($_GET['lat']) : 0;
    $lon = isset($_GET['lon']) ? floatval($_GET['lon']) : 0;

    // Check if coordinates are within valid ranges
    if ($lat < -90 || $lat > 90 || $lon < -180 || $lon > 180) {
        wp_send_json_error('Invalid coordinates');
        wp_die();
    }

    // Your OpenWeatherMap API key (consider making this configurable)
    $apiKey = 'f3a87dcdb0d6f18890adae5df1c8e25b';

    // Build the API request URL with query parameters for weather data
    $url = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&appid={$apiKey}&units=metric&lang=fr";

    // Make the HTTP GET request to the OpenWeatherMap API
    $response = wp_remote_get($url);

    // Handle errors from the HTTP request
    if (is_wp_error($response)) {
        wp_send_json_error('Error retrieving weather data from API');
        wp_die();
    }

    // Decode the JSON response body into an associative array
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Check if the API returned an error code
    if (isset($data['cod']) && $data['cod'] != 200) {
        wp_send_json_error($data['message']);
        wp_die();
    }

    // Return the weather data as a successful JSON response
    wp_send_json_success($data);
    wp_die();
}


