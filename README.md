# Smart Facial Recognition Attendance System

An AI-powered attendance management system using real-time facial recognition built with Python, OpenCV, face_recognition, and Streamlit.

## 🚀 Features

- 📸 Real-time face recognition using webcam
- 🧠 Automatic attendance marking
- 🧍‍♂️ Enroll new users by capturing face data
- 🧾 Export attendance records as CSV
- 🌐 Simple and intuitive web UI using Streamlit

## 🛠️ Tech Stack

- Python 3.8+
- Streamlit
- OpenCV
- face_recognition
- Pandas
- NumPy

## 🧑‍💻 How It Works

1. **User Registration:** Capture a person’s face using webcam and save the encoding with their name.
2. **Attendance Mode:** Start webcam, detect faces, match against known faces, and log attendance with timestamp.
3. **Export Records:** Download the daily attendance report as a CSV file.

## 🏁 Getting Started

### 1. Clone the Repository


git clone https://github.com/g-adarshg098/attendance_app.git
cd attendance_app

### 2. Install Dependencies
Use pip to install required libraries:

bash
Copy
Edit
pip install -r requirements.txt
If requirements.txt is not available, manually install:

bash
Copy
Edit
pip install streamlit opencv-python face_recognition numpy pandas
3. Run the App
bash
Copy
Edit
streamlit run app.py
📂 Folder Structure
bash
Copy
Edit
attendance_app/
│
├── app.py                   # Main Streamlit app
├── enroll.py                # Script for face registration
├── detect.py                # Script for face detection and matching
├── utils/                   # Utility functions
├── face_data/               # Stored encodings and names
├── attendance_records/      # CSV files of attendance logs
└── ...
📊 Sample Output
Live face recognition window with marked names.

CSV file with name, date, and time of attendance.

📌 TODO / Improvements
Add face spoofing prevention

Improve UI and error handling

Store data in a database instead of flat CSV

Admin login for access control

📜 License
MIT License

🤝 Contributors
Your Name

Made with ❤️ using Streamlit and OpenCV

yaml
Copy
Edit

---

Let me know if you'd like:
- A professional project thumbnail for GitHub
- A `requirements.txt` generated from this code
- A `demo.gif` or badge suggestions for the README

I can also help rewrite or tailor this for your resume or academic portfolio.
