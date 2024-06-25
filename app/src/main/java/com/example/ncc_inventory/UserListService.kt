package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.POST

interface UserListService {
        @POST("https://043b-2409-4085-8698-9796-8121-b8c-314d-aadb.ngrok-free.app/users/user-getAll")
        fun getUsers(): Call<List<adapterUserItem>>
}