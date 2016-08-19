<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'RealtimeController@index');

Route::get('/markers', 'RealtimeController@markers');

Route::post('/markers', 'RealtimeController@store');

Route::put('/direction', 'RealtimeController@update');

Route::get('test', function () {
	/**
	 * Testing marker position update smoothly
	 * 
	 * TODO:
	 *  Integrate algorithm in simulation page
	 *  Move markers and update polyfill in map page
	 *  Move markers and create path from origin to current position
	 */
	return view('index');
});