package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface managerListService {
    @POST("https://d24b-2409-4085-8cc8-9517-8ec-f714-4a0e-e522.ngrok-free.app/managers/manager-getAll")
    fun getManagers(): Call<List<managerDataclassFor>>

}