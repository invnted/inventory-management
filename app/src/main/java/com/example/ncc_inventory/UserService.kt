package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface UserService {
    @POST("https://66c7-2409-4085-8818-b6b0-61f4-a7c0-994-3dfc.ngrok-free.app/users/user-register")
    fun addnewUser(@Body user : User): Call<UserResponse>
}