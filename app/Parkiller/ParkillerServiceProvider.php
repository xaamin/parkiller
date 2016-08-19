<?php
namespace App\Parkiller;

use Illuminate\Support\ServiceProvider;

class ParkillerServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerMarkersStorageRepository();
    }

    /**
     * Service to swap backend persistence
     * 
     * @return void
     */
    protected function registerMarkersStorageRepository()
    {
    	$this->app->bind('App\Parkiller\Contracts\MarkerRepositoryInterface', 'App\Parkiller\Cache\MarkerCacheRepository');
    }
}
