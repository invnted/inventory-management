package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.POST

interface UserListService {
        @POST("https://bc21-2409-4085-8818-b6b0-9ca5-483c-4f5b-787f.ngrok-free.app/users/user-getAll")
        fun getUsers(): Call<List<adapterUserItem>>
}