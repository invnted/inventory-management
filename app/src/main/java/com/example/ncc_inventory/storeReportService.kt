package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.POST

interface storeReportService {
    @POST("${rFit.BASE_URL_PLACEHOLDER}products/getAllProduct")
    fun getProducts(): Call<List<storeRespo>>
}