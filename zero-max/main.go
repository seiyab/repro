package main

import (
	"flag"
	"fmt"
	"io"
	"net/http"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func main() {
	configFile := flag.String("f", "etc/upload.yaml", "configuration file")
	flag.Parse()
	var config rest.RestConf
	conf.MustLoad(*configFile, &config)
	server := rest.MustNewServer(config)
	defer server.Stop()
	server.AddRoute(rest.Route{Method: http.MethodPost, Path: "/upload", Handler: upload})
	fmt.Printf("POST http://%s:%d/upload (MaxBytes=%d)\n", config.Host, config.Port, config.MaxBytes)
	server.Start()
}

func upload(w http.ResponseWriter, r *http.Request) {
	// This controls multipart buffering, not the request size limit.
	err := r.ParseMultipartForm(1024)
	if r.MultipartForm != nil {
		defer r.MultipartForm.RemoveAll()
	}
	if err != nil {
		httpx.WriteJson(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		httpx.WriteJson(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	defer file.Close()
	size, err := io.Copy(io.Discard, file)
	if err != nil {
		httpx.WriteJson(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	httpx.OkJson(w, map[string]any{"filename": header.Filename, "bytes": size, "content_length": r.ContentLength})
}
