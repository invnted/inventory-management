package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.POST

interface UserListService {
        @POST("https://d24b-2409-4085-8cc8-9517-8ec-f714-4a0e-e522.ngrok-free.app/users/user-getAll")
        fun getUsers(): Call<List<adapterUserItem>>
}