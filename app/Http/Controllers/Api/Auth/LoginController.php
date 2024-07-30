<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            if (!$user = User::query()->where(['email' => request()->input('email')])->first()) {
                return messageResponse('Sorry, the user is not found.', 404, 'error');
            }
            if (!Hash::check(request()->input('password'), $user->password)) {
                return messageResponse('Sorry, credentials is not matched.', 404, 'error');
            }
            return entityResponse([
                'token' => $user->createToken('authToken')->plainTextToken,
                'user' => $user->only(['name', 'email', 'phone', 'avatars']),
            ], 201, 'success', 'Successfully logged in.');
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function oAuthRedirect($provider)
    {
        try {
            if (!in_array($provider, ['facebook', 'google'])) {
                return messageResponse('Please login using facebook or google', 422, 'error');
            }

            return entityResponse(Socialite::driver($provider)->stateless()->redirect()->getTargetUrl());
        } catch (Exception $e) {
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    public function oAuthCallback($provider)
    {
        try {
            if (!in_array($provider, ['facebook', 'google'])) {
                return messageResponse('Please login using facebook, github or google', 422, 'error');
            }

            if (!$providerUser = Socialite::driver($provider)->stateless()->user()) {
                return messageResponse('Invalid credentials provided.', 422, 'error');
            }

            if (!$user = User::where('email', $providerUser->getEmail())->first()) {
                $picture = $this->saveAvatar($providerUser['picture']);
                $user    = User::create([
                    'type' => 'customer',
                    'provider' => $provider,
                    'provider_id' => $providerUser->getId(),
                    'name' => $providerUser->getName(),
                    'avatars' => $picture,
                    'email' => $providerUser->getEmail(),
                ]);
                $user->markEmailAsVerified();
            }

            $token  = $user->createToken('authToken')->plainTextToken;
            $cookie = cookie('authToken', $token, 3600, null, null, null, false);
            $user   = cookie('user', json_encode($user->only(['name', 'email', 'phone', 'avatars'])), 3600, null, null, null, false);

            return redirect()->route('home')->cookie($cookie)->cookie($user);

            // return entityResponse([
            //     'token' => $user->createToken('authToken')->plainTextToken,
            //     'user'  => $user->only(['name', 'email', 'phone', 'avatars']),
            // ], 201, 'success', 'Successfully logged in.');

        } catch (Exception $e) {
            return $e;
            return messageResponse($e->getMessage(), 500, 'server_error');
        }
    }

    private function saveAvatar($url)
    {
        $file = Image::make($url)->encode("jpg", 80);
        $name = Str::random(5) . '.jpg';

        Storage::disk('regular')->put("profiles/" . $name, $file);
        return 'uploads/profiles/' . $name;
    }

}
