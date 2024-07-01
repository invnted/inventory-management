package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginUserService {
    @POST("https://6f44-2409-4085-8703-90df-bce8-d246-3355-1258.ngrok-free.app/users/user-login")
    fun loginUser(@Body loginUserRequest: loginUserRequest) : Call<loginUserResponse>
}