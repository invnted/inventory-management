package com.example.ncc_inventory

import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit

class OrganizationDemandsNav : AppCompatActivity() {
    private lateinit var searchView: SearchView
    private lateinit var recyclerView: RecyclerView
    private lateinit var backBtn : ImageView
    private lateinit var adapter: orgPendingDEmandAdapter
    private lateinit var retrofit: Retrofit
    private lateinit var tv :TextView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_organization_demands_nav)

        //For transparent status bar
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }


        searchView = findViewById(R.id.svOG)
        recyclerView = findViewById(R.id.rvOG)
        backBtn = findViewById(R.id.bcOG)
        adapter = orgPendingDEmandAdapter(this@OrganizationDemandsNav, emptyList())
        recyclerView.layoutManager = LinearLayoutManager(this)
        retrofit = rFit.retrofit!!
        tv = findViewById(R.id.ogNOd)
        tv.visibility = View.INVISIBLE

        val service = retrofit.create(ogDemandService::class.java)
        service.getdmds().enqueue(object : Callback<ogDemandResponse>{
            override fun onResponse(
                call: Call<ogDemandResponse>,
                response: Response<ogDemandResponse>
            ) {
                if(response.isSuccessful){
                    val respo = response.body()
                    if(respo?.success==true){
                        if(respo.demands.isNotEmpty()){
                           adapter = orgPendingDEmandAdapter(this@OrganizationDemandsNav,respo.demands)
                            recyclerView.adapter = adapter
                        }else{
                            tv.visibility = View.VISIBLE
                        }
                    }
                }else{
                    Toast.makeText(this@OrganizationDemandsNav,"Response failed",Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ogDemandResponse>, t: Throwable) {
                Toast.makeText(this@OrganizationDemandsNav,"Some error occurred",Toast.LENGTH_SHORT).show()
            }

        })
        setupSearchView()
    }

    fun onSimulateBackClick(view: View) {
        onBackPressed()
    }

    private fun setupSearchView() {
        searchView.setOnQueryTextListener(object : androidx.appcompat.widget.SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                if (newText != null) {
                    adapter.filter(newText)
                }
                return true
            }
        })
    }

}