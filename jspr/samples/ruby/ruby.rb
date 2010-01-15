#!/usr/bin/env ruby
require 'json'
require 'cgi'

while true
  STDOUT.flush
  line = ""
  begin
	line = STDIN.readline
  rescue
	break
  end
  if line.length == 0
	break
  end
  if not line =~ /^([0-9]+) (\w+) (.*)$/
	puts "ERROR: bad protocol"
	next
  end
  id = $1
  cmd = $2
  ejson = $3
  args = [""]
  if (ejson != nil)
	json = CGI::unescape(ejson)
	if json != nil and json.length > 0
	  begin
		args = JSON.parse(json)
	  rescue Exception=>e
		puts "ERROR: #{e}"
	  end
	end
  end

  case cmd
  when "getVersion"
	puts "#{id} #{cmd} " + 
	  CGI::escape({
					:version => RUBY_VERSION, 
					:platform => RUBY_PLATFORM, 
					:release_date => RUBY_RELEASE_DATE
				  }.to_json)
  when "getNow"
	puts "#{id} #{cmd} " + 
	  CGI::escape(Time.now.to_json)
  when "md5hex"
	require "digest/md5"
	
	puts "#{id} #{cmd} "+CGI::escape(Digest::MD5.hexdigest(args[0]).to_json)
  else
	puts "#{id} #{cmd} "+CGI::escape("(new Error('ERROR: bad cmd (#{cmd})'))")
  end
end
