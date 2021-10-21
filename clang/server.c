// server side implementation of UDP client-server model
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <string.h>
#include <sys/stat.h>
#include <fcntl.h>

char webpage[] =
"HTTP/1.1 200 OK\r\n"
"Content-Type: text/html; charset=UTF-8\r\n\r\n"
"<!DOCTYPE html>\r\n"
"<html lang='en'>\r\n"
"<head><meta name='author' content='Kaska Miskolczi (BatmanWGD)'>\r\n"
"<meta name='viewport' content='width=device-width, initial-scale=1.0'>\r\n"
"<title>Vanilla CLang WebServer</title>\r\n"
"<meta http-equiv='default-style' content='./emojis.css'></head>\r\n"
"<body><h1>Hello World!</h1>\r\n"
"<p>How are you feeling today?</p><br/>\r\n"
"<ul class='feedback'>\r\n"
"<li class='angry'>\r\n"
"<div id='angry'>\r\n"
"<svg class='eye left'><use xlink:href='#eye'></svg>\r\n"
"<svg class='eye left right rightEye'><use xlink:href='#eye'></svg>\r\n"
"<svg class='mouth'><use xlink:href='#mouth'></svg>\r\n"
"</div>\r\n"
"</li>\r\n"
"<li class='sad'>\r\n"
"<div id='sad'>\r\n"
"<svg class='eye left'><use xlink:href=;#eye'></svg>\r\n"
"<svg class='eye left right rightEye'><use xlink:href='#eye'></svg>\r\n"
"<svg class='mouth'><use xlink:href='#mouth'></svg>\r\n"
"</div>\r\n"
"</li>\r\n"
"<li class='ok'>\r\n"
"<div id='ok'></div>\r\n"
"</li>\r\n"
"<li class='good'>\r\n"
"<div id='good'>\r\n"
"<svg class='eye left'><use xlink:href='#eye'></svg>\r\n"
"<svg class='eye left right rightEye'><use xlink:href='#eye'></svg>\r\n"
"<svg class='mouth'><use xlink:href='#mouth'></svg>\r\n"
"</div>\r\n"
"</li>\r\n"
"<li class='happy active'>\r\n"
"<div id='happy'>\r\n"
"<svg class='eye left'><use xlink:href='#eye'></svg>\r\n"
"<svg class='eye left right rightEye'><use xlink:href='#eye'></svg>\r\n"
"</div>\r\n"
"</li>\r\n"
"</ul>\r\n"
"<svg xmlns='http://www.w3.org/2000/svg' style='display: none;'><symbol xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7 4' id='eye'><path d='M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1'></path></symbol><symbol xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 7' id='mouth'><path d='M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5'></path></symbol></svg>\r\n"
"</body></html>\r\n";

int main(int argc, char *argv[]) {
  struct sockaddr_in server_addr, client_addr;
  socklen_t sin_len = sizeof(client_addr);
  int fd_server, fd_client;
  char buf[4096];
  int fdico;
  int on = 1;
  int SQL_SOCKET = 0;
  int SO_REUSERADDR = 0;

  fd_server = socket(AF_INET, SOCK_STREAM, 0);
  if(fd_server < 0){
    perror("socket");
    exit(1);
  }

  setsockopt(fd_server, SQL_SOCKET, SO_REUSERADDR, &on, sizeof(int));

  server_addr.sin_family = AF_INET;
  server_addr.sin_addr.s_addr = INADDR_ANY;
  server_addr.sin_port = htons(8888);
  //1024 or below and you need superuser permissions

  //initialize bind
  if(bind(fd_server, (struct sockaddr *) &server_addr, sizeof(server_addr)) == -1) {
    //if bind closed, we need to exit server
    perror("bind"); 
    close(fd_server);
    exit(1);
  }

  //listening
  //number of simultaneous connections
  if(listen(fd_server, 10) == -1) {
    perror("listen");
    close(fd_server);
    exit(1);
  }

  //while loop for action of server
  while(1) {
    //start at client waiting for connection
    fd_client = accept(fd_server, (struct sockaddr *) &client_addr, &sin_len);
    if(fd_client == -1) {
      perror("Cannot connect to client. Connection failed...\n");
      continue;
    }
    printf("Client connection successful!\n");
    //child process returns zero, parent receieves child's processID, 
    if(!fork()){
      /*child process*/
      close(fd_server); //because child doesn't need it
      memset(buf, 0, 4096); //clear the buffer and reset
      read(fd_client, buf, 4095);

      printf("%s\n", buf);

      if(!strncmp(buf, "GET /favicon.ico", 16)) {
        fdico = open("clang/favicon.ico", O_RDONLY);
        //destination is client, sending from file ref
        sendfile(fd_client, fdico, 0, (void *)0, NULL, 4000); 

        //sendfile(sockaddr_in, fdico, fdico, MSG_CONFIRM, (const struct sockaddr *) &servaddr, sizeof(servaddr));
        printf("Favicon written successfully!\n");
        
        close(fdico);
      }
      else
        write(fd_client, webpage, sizeof(webpage) -1);

      close(fd_client);
      printf("Running...\n");
    exit(0);

    }

    /*parent process*/
    close(fd_client);
  }
    
  return 0;
};