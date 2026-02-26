<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    //
    public function __construct(protected User $model) {}

    //get all users
    public function getAllUsers()
    {
        $users = User::get();
        return sendResponse($users, 200, "Users get successfully");
    }
}
