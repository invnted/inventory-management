package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface LoginService {
    @POST("https://043b-2409-4085-8698-9796-8121-b8c-314d-aadb.ngrok-free.app/admins/admin-login")// Replace with your actual endpoint
    fun login(@Body loginRequest: LoginRequest): Call<LoginResponse>
}