<?php 
namespace App\Http\Controllers;

use Cache;
use Illuminate\Http\Request;

class RealtimeController extends Controller 
{
	protected $request;

	public function __construct(Request $request)
	{
		$this->request = $request;
	}

	public function index()
	{
		return view('realtime');
	}

	public function markers()
	{
		return Cache::get('parkiller', []);
	}

	public function start()
	{
		Cache::forever('parkiller', $this->request->all());

		return Cache::get('parkiller');
	}

	public function update()
	{

	}
}