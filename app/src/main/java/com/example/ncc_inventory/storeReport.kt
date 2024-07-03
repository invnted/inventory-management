package com.example.ncc_inventory

import android.app.DatePickerDialog
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.view.animation.AnimationUtils
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import java.text.SimpleDateFormat
import java.util.*

class storeReport : AppCompatActivity() {
    private lateinit var fromDateEditText: EditText
    private lateinit var toDateEditText: EditText
    private lateinit var typeSpinner : Spinner
    private lateinit var nameSpinner : Spinner
    private lateinit var brandSpinner : Spinner
    private lateinit var modelSpinner : Spinner
    private var fromCalendar = Calendar.getInstance()
    private var toCalendar = Calendar.getInstance()
    private lateinit var service: storeReportService
    private lateinit var retrofit: Retrofit
    private val types : MutableList<String>  = mutableListOf()
    private val obj : MutableList<storeObj> = mutableListOf()
    private var selectedItem = ""
    private lateinit var btn :TextView
    private var selectedType: String = ""
    private var selectedName: String = ""
    private var selectedModel: String = ""
    private var selectedBrand: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_store_report)

        retrofit = rFit.retrofit!!
        service = retrofit.create(storeReportService::class.java)
        typeSpinner = findViewById(R.id.spinner4)
        nameSpinner = findViewById(R.id.spinner3)
        brandSpinner = findViewById(R.id.spinner6)
        modelSpinner = findViewById(R.id.spinner7)
        nameSpinner.isEnabled = false
        brandSpinner.isEnabled = false
        modelSpinner.isEnabled = false
        //For transparent status bar
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
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
            btn.startAnimation(AnimationUtils.loadAnimation(this,R.anim.click))
            handleSubmitButtonClick()
        }
    }

    private fun handleSubmitButtonClick() {
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

        // Proceed with handling the selected data
        val message = "Selected Type: $selectedType\n" +
                "Selected Name: $selectedName\n" +
                "Selected Model: $selectedModel\n" +
                "Selected Brand: $selectedBrand"

        Toast.makeText(this, message, Toast.LENGTH_LONG).show()

        // You can also proceed with further processing or operations here
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
                    val nameList = selectedObj?.name?: emptyList()
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
        val sdf = SimpleDateFormat("dd-MM-yyyy", Locale.getDefault())
        return sdf.format(calendar.time)
    }
}
