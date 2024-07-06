package com.example.ncc_inventory

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.TextView

class managerDashboard : AppCompatActivity() {
    private lateinit var lly : LinearLayout
    private lateinit var textView: TextView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_manager_dashboard)
        lly = findViewById(R.id.lly)
        textView = findViewById(R.id.maName)
        val check = intent.getBooleanExtra("demand",false)
        val name = intent.getStringExtra("name")
        if(check==true){
            lly.visibility = View.VISIBLE
        }
        textView.text = " Welcome, $name"
    }
}