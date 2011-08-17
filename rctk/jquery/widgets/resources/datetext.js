/*
 * Date is reserved in javascript (or at least already used)
 */
Onion.widget.DateText = function(jwin, parent, controlid) {
    Onion.widget.Text.apply(this, arguments);
    this.name = "datetext";
}

Onion.widget.DateText.prototype = new Onion.widget.Text();

Onion.widget.DateText.prototype.create = function(data) {
    Onion.widget.Text.prototype.create.apply(this, arguments);
    // yy actually means 4-digit.
    this.control.datepicker({dateFormat: "yy-mm-dd"});
}

// register
Onion.widget.register("date", Onion.widget.DateText);
