package com.example.ncc_inventory

import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView

class managerDashboard : AppCompatActivity() {
    private lateinit var lly : LinearLayout
    private lateinit var textView: TextView
    private lateinit var managerAuthStore : ImageView
    private lateinit var click : Animation
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_manager_dashboard)

        //For transparent status bar
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }
        lly = findViewById(R.id.lly)
        textView = findViewById(R.id.maName)
        val check = intent.getBooleanExtra("demand",false)
        val name = intent.getStringExtra("name")
        if(check==true){
            lly.visibility = View.VISIBLE
        }
        textView.text = " Welcome, $name"

        click = AnimationUtils.loadAnimation(this, R.anim.click)
        managerAuthStore = findViewById(R.id.managerAuthStore)
        managerAuthStore.setOnClickListener {
            managerAuthStore.startAnimation(click)
            startActivity(Intent(this,AuthoraizationStrore::class.java))
        }
    }
}