<?php
namespace App\Parkiller\Contracts;

interface MarkerRepositoryInterface
{
	/**
	 * Gets all markers from storage
	 * 
	 * @return \Illuminate\Support\Collection
	 */
	public function all();

	/**
	 * Persists markers in storage
	 * @param array 	$markers
	 * @return bool
	 */
	public function store(array $markers);

	/**
	 * Updates marker position
	 * 
	 * @param integer 	$markerId
	 * @param array 	$data
	 * @return bool
	 */
	public function update($markerId, array $data);
}