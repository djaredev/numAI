# NumAI
Application that uses a convolutional network for handwritten number detection on a canvas via a web interface and a REST API built on top of the network.

## Installation:

Clone the repository:

```bash
git clone https://github.com/djaredev/numAI.git

cd numAI
```
Create a Python virtual environment:
```bash
python -m venv .venv
```
Activate the virtual environment:

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Install PyTorch:

```bash
pip install torch==2.5.0 torchvision==0.20.0 --index-url https://download.pytorch.org/whl/cpu
```

Start the application:

```bash
fastapi run numai/main.py
```

Access [http://localhost:8000](http://localhost:8000)

## Jupyter Notebook

The project notebook contains all the steps used to build the model. You can find it [here.](numai/CNN/Project_CNN.ipynb)

