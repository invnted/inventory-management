package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface UserService {
    @POST("https://0bc0-2409-4085-8818-b6b0-257c-9b25-3fe5-643c.ngrok-free.app/users/user-register")
    fun addnewUser(@Body user : User): Call<UserResponse>
}