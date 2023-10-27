import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
const TelegramBot = require('node-telegram-bot-api');
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { firstValueFrom, lastValueFrom } from 'rxjs';
// import { AxiosResponse } from 'axios';
import axios from 'axios';
import { CronJob } from 'cron';

@Injectable()
export class TgService {
  private readonly bot: any;
  private job: any;
  private location: any;
  constructor(
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.bot = new TelegramBot(process.env.TG_BOT, { polling: true });
    this.bot.onText(/\/start/, this.onStart);
    this.bot.onText(/\/stop/, this.onStop);
    this.bot.onText(/\/help/, this.onHelp);
    this.bot.onText(/\/weather/, this.onWeather);
    this.bot.on('location', this.onReceiveLocation);
  }
  onWeather = async (msg: any) => {
    if (this.location != undefined) {
      try {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.location.lat}&lon=${this.location.lon}&appid=${process.env.WEATHER_API_KEY}`;
        let resp = await firstValueFrom(
          this.httpService
            .get(url)
            .pipe(map((response) => [response.data, response.status])),
        );
        let weather = `Description: ${resp[0].weather[0].description}\nTemperature: ${resp[0].main.temp}K\nHumidity: ${resp[0].main.humidity}%\nPressure: ${resp[0].main.pressure} hPa\nWind speed: ${resp[0].wind.speed} metres/sec\nClouds: ${resp[0].clouds.all}%\n`;
        this.bot.sendMessage(msg.chat.id, weather);
      } catch (err) {
        console.log(err);
      }
    }
    else{
      this.bot.sendMessage(msg.chat.id, "Didn't send location yet.\nStart the service with /start and send location to get weather updates and stop service with /stop");
    }
  };
  onHelp = (msg: any) => {
    this.bot.sendMessage(
      msg.chat.id,
      'Welcome to weather bot, /start would initialize the service and when you send your current location it automatically starts the cron job to send default weather updates everyday at 8:00 AM.\nYou can configure the time of day you want the update by adding space seperated military formatted time HHMM or to get updates every X hours send a space seperated number between 0 and 25, 24 being daily from now \n/start to start service\n/stop to stop service\n/help to see this message\n/weather to get current weather',
    );
  };
  onStop = (msg: any) => {
    console.log(msg);
    if (this.job != undefined) {
      this.job.stop();
      this.schedulerRegistry.deleteCronJob('myCronJob');
      this.job = undefined;
      this.bot.sendMessage(msg.chat.id, 'Stopped service');
    } else {
      this.bot.sendMessage(msg.chat.id, 'Service not started yet');
    }
  };
  onStart = (msg: any) => {
    // console.log(msg);
    const isNumber = (value: string): boolean => {
      return value != null && value != '' && !isNaN(Number(value.toString()));
    };
    console.log('initialized job');
    if (this.job == undefined) {
      let freq = msg.text.split(' ', 2)[1];
      if (freq == undefined) freq = '0 0 8 * * *';
      else if (freq.length <= 4) {
        if (freq.length == 4 && isNumber(freq)) {
          let hour = Number(freq.slice(0, 2));
          let min = Number(freq.slice(2, 4));
          if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
            this.bot.sendMessage(
              msg.chat.id,
              `Setting reminder to ${hour}:${min}`,
            );
            freq = `0 ${min} ${hour} * * *`;
          } else {
            this.bot.sendMessage(
              msg.chat.id,
              `Invalid setting, using default of daily reminder at 8:00`,
            );
            freq = '0 0 8 * * *';
          }
        } else if (isNumber(freq) && Number(freq) > 0 && Number(freq) < 25) {
          this.bot.sendMessage(
            msg.chat.id,
            `Sending weather update every ${freq} hours from now`,
          );
          freq = `0 0 */${freq} * * *`;
        } else {
          this.bot.sendMessage(
            msg.chat.id,
            `Invalid setting, using default of daily reminder at 8:00`,
          );
          freq = '0 0 8 * * *';
        }
      } else {
        this.bot.sendMessage(
          msg.chat.id,
          `Invalid setting, using default of daily reminder at 8:00`,
        );
        freq = '0 0 8 * * *';
      }
      this.job = new CronJob(freq, async () => {
        if (this.location != undefined) {
          try {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.location.lat}&lon=${this.location.lon}&appid=${process.env.WEATHER_API_KEY}`;
            let resp = await firstValueFrom(
              this.httpService
                .get(url)
                .pipe(map((response) => [response.data, response.status])),
            );
            let weather = `Description: ${resp[0].weather[0].description}\nTemperature: ${resp[0].main.temp}K\nHumidity: ${resp[0].main.humidity}%\nPressure: ${resp[0].main.pressure} hPa\nWind speed: ${resp[0].wind.speed} metres/sec\nClouds: ${resp[0].clouds.all}%\n`;
            this.bot.sendMessage(msg.chat.id, weather);
          } catch (err) {
            console.log(err);
          }
        }
      });
      this.schedulerRegistry.addCronJob('myCronJob', this.job);
      this.job.start();
      this.bot.sendMessage(
        msg.chat.id,
        'Welcome to weather bot, weather messages will start once you send location',
      );
    } else {
      this.bot.sendMessage(msg.chat.id, 'Service already started, use /stop');
    }
  };
  onReceiveLocation = async (msg: any) => {
    try {
      if (this.job == undefined)
        this.bot.sendMessage(
          msg.chat.id,
          'Service not started yet, try /help command to see flow of commands',
        );
      else {
        this.location = {
          lat: msg.location.latitude,
          lon: msg.location.longitude,
        };
        this.job.start();
        this.bot.sendMessage(
          msg.chat.id,
          'Service started, you will receive weather messages according to config',
        );
      }
    } catch {
      console.log('location error');
    }
  };
}
