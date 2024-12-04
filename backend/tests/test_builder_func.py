from app.builder import Builder


def test_crafter():
    builder = Builder()
    data = "In 2024, global internet usage surged, with overall penetration reaching 68%. Mobile internet accounted for 70% of access, fixed broadband represented 25%, and satellite and other technologies made up the remaining 5%. These trends underscore the growing dominance of mobile connectivity and the continued evolution of digital infrastructure worldwide"
    response = builder._craft_story(data)
    print(response)

def test_gen_code():
    builder = Builder()
    data = "In 2024, global internet usage surged, with overall penetration reaching 68%. Mobile internet accounted for 70% of access, fixed broadband represented 25%, and satellite and other technologies made up the remaining 5%. These trends underscore the growing dominance of mobile connectivity and the continued evolution of digital infrastructure worldwide"
    response = builder._gen_code(data)
    print(response)


if __name__ == "__main__":
    # test_crafter()
    test_gen_code()