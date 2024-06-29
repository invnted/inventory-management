package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginUserService {
    @POST("https://8628-2409-4085-8703-90df-d85c-f5b5-8b86-4a0d.ngrok-free.app/users/user-login")
    fun loginUser(@Body loginUserRequest: loginUserRequest) : Call<loginUserResponse>
}