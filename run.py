import subprocess
import sys

if __name__ == "__main__":
    subprocess.Popen([sys.executable, "api.py"])
    subprocess.Popen([sys.executable, "frontend.py"])

    while True:
        input("Running...")
