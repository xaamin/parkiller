<?php
namespace App\Parkiller\Cache;

use Illuminate\Cache\Repository;
use App\Parkiller\Contracts\MarkerRepositoryInterface as MarkerRepositoryContract;

class MarkerCacheRepository implements MarkerRepositoryContract
{	
	/**
	 * Cache repository 
	 * 
	 * @var \Illuminate\Cache\Repository
	 */
	public $cache;

	/**
	 * Constructor 
	 * 
	 * @param \Illuminate\Cache\Repository $cache
	 */
	public function __construct(Repository $cache)
	{
		$this->cache = $cache;
	}

	/**
     * {@inheritDoc}
     */
	public function all()
	{
		return $this->cache->get('parkiller');
	}

	/**
     * {@inheritDoc}
     */
	public function store(array $markers)
	{
		$this->cache->forever('parkiller', $markers);

		return $this->cache->has('parkiller');
	}

	/**
     * {@inheritDoc}
     */
	public function update($markerId, array $data)
	{
		/**
		 * TODO:
		 * 
		 * Update only one marker
		 */
	}
}