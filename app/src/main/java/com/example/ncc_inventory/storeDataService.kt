package com.example.ncc_inventory

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface storeDataService {
    @POST("${rFit.BASE_URL_PLACEHOLDER}products/storeReport")
    fun getStoreReport(@Body storereportRequest: storereportRequest) : Call<List<Report>>
}