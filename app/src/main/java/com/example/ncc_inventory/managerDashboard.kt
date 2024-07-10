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
    private lateinit var managerAddCategory : ImageView
    private lateinit var managerAdduser :ImageView
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
        click = AnimationUtils.loadAnimation(this, R.anim.click)
        if(check==true){
            lly.visibility = View.VISIBLE
            val managerDemandReceived : ImageView = findViewById(R.id.managerDemandReceived)
            managerDemandReceived.setOnClickListener {
                managerDemandReceived.startAnimation(click)
                startActivity(Intent(this@managerDashboard,managerDemandReceivedPanel::class.java))
            }
        }
        textView.text = " Welcome, $name"

        managerAuthStore = findViewById(R.id.managerAuthStore)
        managerAuthStore.setOnClickListener {
            managerAuthStore.startAnimation(click)
            startActivity(Intent(this,AuthoraizationStrore::class.java))
        }

        managerAddCategory = findViewById(R.id.managerAddCategory)
        managerAddCategory.setOnClickListener {
            managerAddCategory.startAnimation(click)
            startActivity(Intent(this,addCategory::class.java))
        }

        managerAdduser = findViewById(R.id.managerAdduser)
        managerAdduser.setOnClickListener {
            managerAdduser.startAnimation(click)
            startActivity(Intent(this,addUser::class.java))
        }


    }
}