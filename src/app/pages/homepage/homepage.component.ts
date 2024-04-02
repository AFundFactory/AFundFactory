import { Component, OnInit, OnDestroy } from '@angular/core';
import { Campaign } from 'src/app/models/campaign.model';
import * as p5 from 'p5';
import { TzktService } from 'src/app/services/tzkt.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

  public lastCampaigns: Campaign[] = []
  public loadingCampaigns = true
  private p5!: p5;

  constructor(
    private tzkt: TzktService
  ){}

  ngOnInit() {

    this.tzkt.getAllCampaigns().subscribe(campaigns => {
      this.lastCampaigns = this.getRandomCampaigns(campaigns, 3)
      if (campaigns.length > 0) this.loadingCampaigns = false
    })

    this.p5 = new p5(this.sketch);
  }

  getRandomCampaigns(campaigns: Campaign[], n: number) {
    var result = new Array(n),
        len = campaigns.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = campaigns[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


  sketch(p: p5) {

    const grayRamp = "                                 `~._^|',-!:}+{=\/*;[]7oc><i?)(rlt1jsIz3vCuJ%5aYn\"298e0f&L6OS$VGZxTyUhP4wkDFdgqbRpmX@QAEHK#BNWM"
    const rampLength = grayRamp.length;

    const inc = 0.1;
    const incStart = 0.1;
    const magInc = 0.02;
    const scl = 15;
    const fps = 8;
    var cols: any, rows: any;
    var zoff = 0;
    var magOff = 0;

    p.windowResized = () => {
      p.setup()
    }

    p.setup = () => {

      const canvasDiv = document.getElementById('ascii-banner');
      const height = canvasDiv ? canvasDiv.offsetHeight : 0;
      const canvas = p.createCanvas(1.05 * p.windowWidth, height).parent('ascii-banner');

      canvas.position(0, 0)
      canvas.style('z-index', '-1')
      canvas.style('padding:0px')
      canvas.style('position:absolute')

      cols = Math.floor(p.width / scl) + 2;
      rows = Math.floor(p.height / scl) + 2;
      
      p.background('#fdd835');
      p.fill(255);
      p.frameRate(fps)

      p.textSize(scl);
      p.textFont('Montserrat');

    }

    p.draw = () => {
      p.background('#fdd835');
      
      var yoff = 0;
      for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
          const m = p.map(p.noise(xoff, yoff, magOff), 0, 1, 0, rampLength-1);

          p.push();
          p.translate(x * scl, y * scl);
          p.text(grayRamp[Math.round(m)], 0, 0);
          p.pop();

          xoff += inc;
        }
        yoff += inc;
      }
      magOff += magInc;
      zoff += incStart;

    }

  }


  ngOnDestroy() { 
    this.p5.remove()
  }

}
