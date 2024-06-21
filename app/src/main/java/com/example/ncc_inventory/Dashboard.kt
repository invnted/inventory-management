package com.example.ncc_inventory

import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.WindowManager
import android.view.animation.Animation
import android.view.animation.AnimationUtils
import android.widget.ImageView
import android.widget.TextView

class Dashboard : AppCompatActivity() {
    private lateinit var userName : TextView
    private lateinit var profile : ImageView
    private lateinit var category : ImageView
    private lateinit var addmanager31 : ImageView
    private lateinit var AddUser : ImageView
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        val click = AnimationUtils.loadAnimation(this,R.anim.click)
        userName = findViewById(R.id.adminName)
        profile = findViewById(R.id.profile)

        //For transparent status bar
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }

        //getting details

        val adminName = intent.getStringExtra("userName")
        val adminEmail = intent.getStringExtra("userEmail")
        val role = intent.getStringExtra("role")
        val id = intent.getStringExtra("id")
        val department = intent.getStringExtra("department")

        //setting admin name in dashboard
        userName.text = "Welcome, $adminName"

        //profile section
        profile.setOnClickListener {
            if (adminName != null && adminEmail != null && role != null && id!=null && department!=null) {
                profileSection(profile,click,adminName,adminEmail,role,id,department)
            }
        }

        category = findViewById(R.id.category)
        category.setOnClickListener {
            category.startAnimation(click)
            startActivity(Intent(this,addCategory::class.java))
        }

        addmanager31 = findViewById(R.id.addManager12)
        addmanager31.setOnClickListener {
            addmanager31.startAnimation(click)
            startActivity(Intent(this@Dashboard,ManagerActivity::class.java))
        }

        AddUser = findViewById(R.id.AddUser)
        AddUser.setOnClickListener {
            AddUser.startAnimation(click)
            startActivity(Intent(this,addUser::class.java))
        }
    }
    private fun profileSection(profile : ImageView,click : Animation, adminName : String ,adminEmail : String , role : String ,  id : String , department : String){
        profile.startAnimation(click)
        val it = Intent(this,profileActivity::class.java)
        it.putExtra("userName",adminName)
        it.putExtra("userEmail",adminEmail)
        it.putExtra("role",role)
        it.putExtra("id",id)
        it.putExtra("department",department)
        startActivity(it)
    }
}