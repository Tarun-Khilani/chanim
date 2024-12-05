import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.builder import Builder

DATA = ("In 2024, global internet usage surged, with overall penetration reaching 68%. "
        "Mobile internet accounted for 70% of access, fixed broadband represented 25%, "
        "and satellite and other technologies made up the remaining 5%. "
        "These trends underscore the growing dominance of mobile connectivity and "
        "the continued evolution of digital infrastructure worldwide")
builder = Builder()

def test_crafter():
    response = builder._craft_story(DATA)
    print(response)

def test_gen_code():
    response = builder._gen_code_manim(DATA)
    print(response)

def test_gen_code_remotion():
    response = builder._gen_code_remotion(DATA)
    print(response)


if __name__ == "__main__":
    # test_crafter()
    # test_gen_code()
    test_gen_code_remotion()