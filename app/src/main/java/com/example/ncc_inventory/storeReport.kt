package com.example.ncc_inventory

import android.Manifest
import android.app.Activity
import android.app.DatePickerDialog
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.view.WindowManager
import android.view.animation.AnimationUtils
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.provider.Settings
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import java.io.BufferedWriter
import java.io.File
import java.io.FileOutputStream
import java.io.FileWriter
import java.io.IOException
import java.io.OutputStreamWriter
import java.text.SimpleDateFormat
import java.util.*

class storeReport : AppCompatActivity() {
    private lateinit var fromDateEditText: EditText
    private lateinit var toDateEditText: EditText
    private lateinit var typeSpinner: Spinner
    private lateinit var nameSpinner: Spinner
    private lateinit var brandSpinner: Spinner
    private lateinit var modelSpinner: Spinner
    private var fromCalendar = Calendar.getInstance()
    private var toCalendar = Calendar.getInstance()
    private lateinit var service: storeReportService
    private lateinit var retrofit: Retrofit
    private val types: MutableList<String> = mutableListOf()
    private val obj: MutableList<storeObj> = mutableListOf()
    private var selectedItem = ""
    private lateinit var btn: TextView
    private var selectedType: String = ""
    private var selectedName: String = ""
    private var selectedModel: String = ""
    private var selectedBrand: String = ""
    private lateinit var recyclerView: RecyclerView
    private lateinit var downloadCsvbtn: TextView
    private lateinit var respo: List<Report>

    private val REQUEST_WRITE_STORAGE_PERMISSION = 100
    private val REQUEST_CODE_PERMISSION_MANAGE_EXTERNAL_STORAGE = 102
    private val REQUEST_CODE_SAVE_CSV = 101 // Replace with any unique integer you prefer



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_store_report)

        retrofit = rFit.retrofit!!
        service = retrofit.create(storeReportService::class.java)
        typeSpinner = findViewById(R.id.spinner4)
        nameSpinner = findViewById(R.id.spinner3)
        brandSpinner = findViewById(R.id.spinner6)
        modelSpinner = findViewById(R.id.spinner7)
        downloadCsvbtn = findViewById(R.id.download_csv_btn)
        downloadCsvbtn.isEnabled = false
        downloadCsvbtn.visibility = View.INVISIBLE
        nameSpinner.isEnabled = false
        brandSpinner.isEnabled = false
        modelSpinner.isEnabled = false
        recyclerView = findViewById(R.id.storeReportRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        // For transparent status bar
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            window.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)
        }

        fromDateEditText = findViewById(R.id.fromD)
        toDateEditText = findViewById(R.id.ToD)

        fromDateEditText.setOnClickListener {
            showDatePickerDialog(fromDateEditText, fromCalendar)
        }

        toDateEditText.setOnClickListener {
            showDatePickerDialog(toDateEditText, toCalendar)
        }

        fetchDataAndPopulateSpinner()

        btn = findViewById(R.id.vBtn)
        btn.setOnClickListener {
            btn.startAnimation(AnimationUtils.loadAnimation(this, R.anim.click))
            handleSubmitButtonClick()
        }
    }

    private fun handleSubmitButtonClick() {
        recyclerView.visibility = View.INVISIBLE
        // Check if spinners are enabled and populated
        if (!nameSpinner.isEnabled || !modelSpinner.isEnabled || !brandSpinner.isEnabled) {
            Toast.makeText(this, "Please select a Type first", Toast.LENGTH_SHORT).show()
            return
        }

        // Get selected values from spinners
        selectedType = typeSpinner.selectedItem?.toString() ?: ""
        selectedName = nameSpinner.selectedItem?.toString() ?: ""
        selectedModel = modelSpinner.selectedItem?.toString() ?: ""
        selectedBrand = brandSpinner.selectedItem?.toString() ?: ""

        // Validate if a selection other than the hint was made
        if (selectedType.isBlank() || selectedName == "Select Name" ||
            selectedModel == "Select Model" || selectedBrand == "Select Brand") {
            Toast.makeText(this, "Please select valid options", Toast.LENGTH_SHORT).show()
            return
        }

        // Get dates from EditTexts
        val fromDate = fromDateEditText.text.toString()
        val toDate = toDateEditText.text.toString()

        // Validate dates
        if (fromDate.isBlank() || toDate.isBlank()) {
            Toast.makeText(this, "Please select valid dates", Toast.LENGTH_SHORT).show()
            return
        }
        val request = storereportRequest(selectedType, selectedName, selectedModel, selectedBrand, fromDate, toDate)
        val service = retrofit.create(storeDataService::class.java)
        service.getStoreReport(request).enqueue(object : Callback<List<Report>> {
            override fun onResponse(call: Call<List<Report>>, response: Response<List<Report>>) {
                downloadCsvbtn.isEnabled = false
                downloadCsvbtn.visibility = View.INVISIBLE
                if (response.isSuccessful) {
                    respo = response.body()!!
                    if (!respo.isNullOrEmpty()) {
                        val adapter = storeReportAdapter(respo)
                        recyclerView.adapter = adapter
                        recyclerView.visibility = View.VISIBLE
                        // Enable and show the download button
                        downloadCsvbtn.isEnabled = true
                        downloadCsvbtn.visibility = View.VISIBLE

                        // Set up the click listener for the download button
                        downloadCsvbtn.setOnClickListener {
                            if (checkAndRequestPermissions()) {
                                writeDataToCSV(this@storeReport, respo)
                            }
                        }
                    } else {
                        Toast.makeText(this@storeReport, "Response is null", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@storeReport, "Response Unsuccessful", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Report>>, t: Throwable) {
                Toast.makeText(this@storeReport, "Response failure", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun fetchDataAndPopulateSpinner() {
        service.getProducts().enqueue(object : Callback<List<storeRespo>> {
            override fun onResponse(call: Call<List<storeRespo>>, response: Response<List<storeRespo>>) {
                if (response.isSuccessful) {
                    val respo = response.body()
                    if (respo != null) {
                        respo.forEach { storeRespo ->
                            val type = storeRespo.productType
                            val details = storeRespo.details
                            val nameList = mutableListOf<String>()
                            val modelList = mutableListOf<String>()
                            val brandList = mutableListOf<String>()

                            details.forEach { detail ->
                                nameList.add(detail.productName)
                                modelList.add(detail.productModel)
                                brandList.add(detail.productBrand)
                            }
                            obj.add(storeObj(type, nameList, modelList, brandList))
                            types.add(type)
                        }
                        populateTypeSpinner()
                    }
                } else {
                    Toast.makeText(this@storeReport, "Failed Response", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<storeRespo>>, t: Throwable) {
                Toast.makeText(this@storeReport, "Some error Occurred", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun populateTypeSpinner() {
        // Add hint "Select Type" at the beginning of the types list
        types.add(0, "Select Type")

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, types)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        typeSpinner.adapter = adapter

        typeSpinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
                selectedItem = parent.getItemAtPosition(position).toString()
                if (position > 0) {
                    // Get the selected type
                    val selectedType = types[position]

                    // Filter obj to find the selected type
                    val selectedObj = obj.find { it.type == selectedType }

                    // Populate nameSpinner with names for the selected type
                    val nameList = selectedObj?.name ?: emptyList()
                    val nameAdapter = createSpinnerAdapter(nameList, "Select Name")
                    nameSpinner.adapter = nameAdapter

                    // Populate modelSpinner with models for the selected type
                    val modelList = selectedObj?.model ?: emptyList()
                    val modelAdapter = createSpinnerAdapter(modelList, "Select Model")
                    modelSpinner.adapter = modelAdapter

                    // Populate brandSpinner with brands for the selected type
                    val brandList = selectedObj?.brand ?: emptyList()
                    val brandAdapter = createSpinnerAdapter(brandList, "Select Brand")
                    brandSpinner.adapter = brandAdapter

                    // Enable spinners
                    nameSpinner.isEnabled = true
                    brandSpinner.isEnabled = true
                    modelSpinner.isEnabled = true
                } else {
                    // Clear spinners and disable them when "Select Type" is selected
                    clearSpinners()
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                clearSpinners()
            }
        }
    }

    private fun createSpinnerAdapter(data: List<String>, hint: String): ArrayAdapter<String> {
        // Add hint at the beginning of the data list
        val dataList = mutableListOf<String>()
        dataList.add(hint)
        dataList.addAll(data)

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, dataList)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        return adapter
    }

    private fun clearSpinners() {
        nameSpinner.adapter = null
        modelSpinner.adapter = null
        brandSpinner.adapter = null

        nameSpinner.isEnabled = false
        brandSpinner.isEnabled = false
        modelSpinner.isEnabled = false
    }

    private fun showDatePickerDialog(editText: EditText, calendar: Calendar) {
        val datePickerDialog = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                calendar.set(year, month, dayOfMonth)
                editText.setText(getFormattedDate(calendar))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePickerDialog.show()
    }

    private fun getFormattedDate(calendar: Calendar): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return sdf.format(calendar.time)
    }

    private fun checkAndRequestPermissions(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (!Environment.isExternalStorageManager()) {
                requestManageExternalStoragePermission()
                false
            } else {
                true
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                    REQUEST_WRITE_STORAGE_PERMISSION
                )
                false
            } else {
                true
            }
        }
    }

    private fun requestManageExternalStoragePermission() {
        try {
            val intent = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION)
            intent.data = Uri.parse("package:$packageName")
            startActivityForResult(intent, REQUEST_CODE_PERMISSION_MANAGE_EXTERNAL_STORAGE)
        } catch (e: Exception) {
            Toast.makeText(this, "Permission request failed", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_WRITE_STORAGE_PERMISSION) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                writeDataToCSV(this, respo)
            } else {
                Toast.makeText(this, "Permission Denied", Toast.LENGTH_SHORT).show()
            }
        }
    }
    private var reportData: List<Report>? = null
    private fun writeDataToCSV(context: Context, data: List<Report>) {
        reportData = data
        val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/csv"
            putExtra(Intent.EXTRA_TITLE, "report.csv") // Default filename suggestion
        }

        startActivityForResult(intent, REQUEST_CODE_SAVE_CSV)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_CODE_SAVE_CSV && resultCode == Activity.RESULT_OK) {
            val dataList = reportData // Retrieve the stored data list
            val uri = data?.data

            if (dataList != null && uri != null) {
                writeCSVContentToUri(uri, dataList)
            } else {
                Toast.makeText(this, "Error: Unable to retrieve data or URI", Toast.LENGTH_SHORT).show()
            }
        }
    }


    private fun writeCSVContentToUri(uri: Uri,data: List<Report>) {
        try {
            contentResolver.openFileDescriptor(uri, "w")?.use { fileDescriptor ->
                FileOutputStream(fileDescriptor.fileDescriptor).use { outputStream ->
                    BufferedWriter(OutputStreamWriter(outputStream)).use { writer ->
                        // Write CSV content here
                        writer.append("Product ID,Product Brand,Status,Created At,Product Name,Product Model,Product Type\n")
                        for (item in data) {
                            writer.append("${item.productId},${item.productBrand},${item.status},${item.createdAt},${item.productName},${item.productModel},${item.productType}\n")
                        }
                    }
                }
            }
            Toast.makeText(this, "File Successfully Created", Toast.LENGTH_SHORT).show()
        } catch (e : IOException){
            Toast.makeText(this@storeReport, "Error creating CSV file", Toast.LENGTH_SHORT).show()
        }
    }


}
