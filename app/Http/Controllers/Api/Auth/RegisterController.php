<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthUpdateRequest;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            if (User::query()->where(['email' => request()->input('email')])->first()) {
                return messageResponse("Sorry, you're already registered.", 404, 'error');
            }
            User::query()->create($request->validated());
            return messageResponse("Great!, Now you're successfully register.");
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function updateProfile(AuthUpdateRequest $request)
    {
        try {
            if (!$user = User::where('id', auth()->id())->first()) {
                return messageResponse('Sorry, user not found', 404, 'error');
            }
            $user->update($request->validated());
            return entityResponse([
                'token' => $user->createToken('authToken')->plainTextToken,
                'user' => $user->only(['name', 'email', 'phone', 'avatars']),
            ], 201, 'success', 'Grate! The account has been updated.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            if (!Hash::check($request->input('current_password'), auth()->user()->password)) {
                return messageResponse('Sorry! The current password is not correct.', 403, 'error');
            }
            auth()->user()->password = $request->input('password');
            auth()->user()->update();
            return messageResponse('Grate! The password has been changed.', 201, 'success');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }
}
