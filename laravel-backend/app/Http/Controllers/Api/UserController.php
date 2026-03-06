<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    public function __construct(protected User $model) {}

    //get all users
    public function getAllUsers()
    {
        $users = User::whereNot('id', Auth::user()->id)->get();
        foreach ($users as $user) {
            $user->image = asset('storage/' . $user->image);
        }
        return sendResponse($users, 200, "Users get successfully");
    }
}
