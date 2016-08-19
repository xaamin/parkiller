<?php 
namespace App\Http\Controllers;

use Cache;
use Illuminate\Http\Request;
use App\Parkiller\Contracts\MarkerRepositoryInterface;

class RealtimeController extends Controller 
{
	/**
	 * Request instance
	 * 
	 * @var \lluminate\Http\Request
	 */
	protected $request;

	/**
	 * Implementation of storage repository 
	 * 
	 * @var \App\Parkiller\Contracts\MarkerRepositoryInterface
	 */
	protected $repository;

	/**
	 * Constructor
	 * 
	 * @param \Illuminate\Http\Request                   			$request
	 * @param \App\Parkiller\Contracts\MarkerRepositoryInterface 	$repository 
	 */
	public function __construct(Request $request, MarkerRepositoryInterface $repository)
	{
		$this->request = $request;
		$this->repository = $repository;
	}

	/**
	 * Shows main template
	 * 
	 * @return \Illuminate\Contracts\View\View
	 */
	public function index()
	{
		return view('material');
	}

	/**
	 * Retrieves markers from storage
	 * 
	 * @return mixed
	 */
	public function markers()
	{
		return $this->repository->all();
	}

	/**
	 * Store markers received from maps
	 * 
	 * @return void
	 */
	public function store()
	{
		$this->repository->store($this->request->all());

		return $this->markers();
	}

	/**
	 * Updates marker position in storage
	 * 
	 * @return \Illuminate\Http\Response
	 */
	public function update()
	{
		/**
		 * TODO:
		 * 
		 * Send to persistent storage repository to
		 * update one marker
		 */
		
		// Mock data to please front-end
		$data = [
			'success' => true,
			'message' => 'Marker updated successfully',
			'details' => [
				'code' => 'success'
			]
		];

		return response()->json($data);
	}
}