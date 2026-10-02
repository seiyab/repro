package main

import (
	"encoding/json"
	"log"
	"net/http"

	gofrhttp "gofr.dev/pkg/gofr/http"
)

type payload struct {
	Name string `json:"name" form:"name"`
	Age  int    `json:"age" form:"age"`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /bind", bind)
	log.Println("listening on http://localhost:8000; POST /bind")
	log.Fatal(http.ListenAndServe(":8000", mux))
}

func bind(w http.ResponseWriter, r *http.Request) {
	var value payload
	request := gofrhttp.NewRequest(r)
	err := request.Bind(&value)

	// Include both the target and the error to make partial binding visible.
	result := struct {
		Value payload `json:"value"`
		Error string  `json:"error,omitempty"`
	}{Value: value}
	if err != nil {
		result.Error = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	if err := json.NewEncoder(w).Encode(result); err != nil {
		log.Printf("encode response: %v", err)
	}
}
