package main

func main() {
	var fn1 func(int)
	fn1 = func(i int) {
		if i < 0 {
			return
		}
		fn1(i-1)
	}
}

func fn2(i int) {
	if i < 0 {
		return
	}
	fn2(i-1)
}
